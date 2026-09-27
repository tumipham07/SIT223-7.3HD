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
                    // Use the SonarScanner tool configured in Jenkins
                    def scannerHome = tool 'SonarScanner'

                    // Connect this analysis to our configured SonarQube server
                    withSonarQubeEnv('SonarQube-SIT223') {

                        // Windows Jenkins uses the .bat scanner executable
                        bat "\"${scannerHome}\\bin\\sonar-scanner.bat\""
                    }
                }

                echo 'SonarQube analysis completed.'
            }
        }
    }
}