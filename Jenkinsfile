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

                // Retry in case the npm audit service has a temporary network failure
                    retry(3) {
                    bat 'npm audit --audit-level=moderate'
                }

                dir('backend') {
                    retry(3) {
                        bat 'npm audit --audit-level=moderate'
                    }
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
        stage('Release') {
            steps {
                echo 'Promoting the tested staging images to production...'

                // Load the backend environment file and Firebase credential
                // securely from Jenkins Credentials.
                withCredentials([
                    file(credentialsId: 'backend-env-file', variable: 'BACKEND_ENV_FILE'),
                    file(credentialsId: 'firebase-service-account', variable: 'FIREBASE_SERVICE_FILE')
                ]) {

                    bat '''
                        REM Create the backend config folder if it does not already exist
                        if not exist backend\\config mkdir backend\\config

                        REM Copy the secure Jenkins-managed environment file into the workspace
                        copy /Y "%BACKEND_ENV_FILE%" "backend\\.env"

                        REM Copy the Firebase service account into the workspace
                        copy /Y "%FIREBASE_SERVICE_FILE%" "backend\\config\\serviceAccountKey.json"

                        REM Create a unique version number using the Jenkins build number
                        REM Example: build-16, build-17, build-18
                        set IMAGE_TAG=build-%BUILD_NUMBER%

                        REM Tag the tested staging backend image with the release version
                        REM This promotes the same image instead of rebuilding a new one
                        "C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" tag sit223-backend:staging sit223-backend:%IMAGE_TAG%

                        REM Tag the tested staging frontend image with the release version
                        "C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" tag sit223-frontend:staging sit223-frontend:%IMAGE_TAG%

                        REM Stop and remove the previous production containers if they exist
                        REM The -p option keeps production separate from the staging environment
                        "C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\cli-plugins\\docker-compose.exe" -p sit223-production -f compose.production.yaml down

                        REM Start the production environment using the versioned images
                        REM No Docker image rebuild happens here
                        "C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\cli-plugins\\docker-compose.exe" -p sit223-production -f compose.production.yaml up -d

                        REM Display the production container status as release evidence
                        "C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\cli-plugins\\docker-compose.exe" -p sit223-production -f compose.production.yaml ps
                    '''
                }

                // This message is shown only if all release commands succeed
                echo 'Versioned production release completed successfully.'
            }
        }
    }
}
