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
    }
}