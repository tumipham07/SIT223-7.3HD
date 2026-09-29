pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                echo 'Building SIT223 DevOps project...'

                // Install and build the React frontend
                bat 'npm ci'
                bat 'npm run build'

                // Install backend dependencies
                dir('backend') {
                    bat 'npm ci'
                }

                echo 'Build stage completed successfully.'
            }
        }
        stage('Test') {
            steps {
                echo 'Running automated backend tests...'
                
                // Run Jest and Supertest automated API tests
                dir('backend') {
                    bat 'npm test'
                }

            echo 'All automated tests passed successfully.'
            }
        }
        
        stage('Code Quality') {
            steps {
                echo 'Running SonarQube code quality analysis...'

                script {
                    // Use the SonarScanner installation configured in Jenkins
                    def scannerHome = tool 'SonarScanner'

                    // Send the analysis to our SonarQube server
                    withSonarQubeEnv('SonarQube-SIT223') {
                        bat "\"${scannerHome}\\bin\\sonar-scanner.bat\""
                    }
                }
    
                // Wait for SonarQube to return the Quality Gate result
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
                echo 'SonarQube Quality Gate passed successfully.'
            }
        }
        stage('Security') {
            steps {
                echo 'Running dependency security scans...'

                // Check frontend dependencies.
                // Jenkins fails this stage if a moderate-or-higher vulnerability is found.
                bat 'npm audit --audit-level=moderate'

                // Check backend dependencies separately.
                dir('backend') {
                bat 'npm audit --audit-level=moderate'
                }

                echo 'Security scan passed: no moderate-or-higher vulnerabilities found.'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying application to the staging environment...'

                withCredentials([
                    file(credentialsId: 'backend-env-file', variable: 'BACKEND_ENV_FILE'),
                    file(credentialsId: 'firebase-service-account', variable: 'FIREBASE_SERVICE_FILE')
                ]) {

                    // Place the Jenkins-managed secrets where Docker Compose expects them
                    bat '''
                        if not exist backend\\config mkdir backend\\config

                        copy /Y "%BACKEND_ENV_FILE%" "backend\\.env"
                        copy /Y "%FIREBASE_SERVICE_FILE%" "backend\\config\\serviceAccountKey.json"

                        "C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\cli-plugins\\docker-compose.exe" -f compose.staging.yaml down

                        "C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\cli-plugins\\docker-compose.exe" -f compose.staging.yaml up -d --build

                        "C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\cli-plugins\\docker-compose.exe" -f compose.staging.yaml ps
                    '''
                }

                echo 'Staging deployment completed.'
            }
        }
    }
}
