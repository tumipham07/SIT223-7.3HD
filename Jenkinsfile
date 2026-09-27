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

        dir('backend') {
            bat 'npm test'
        }

        echo 'All automated tests passed successfully.'
    }
}
    }
}