pipeline {
    agent any
    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/vigta257/calculator-app.git'
            }
        }
        stage('Test Docker Availability') {
            steps {
                script {
                    sh 'which docker'
                    sh 'docker --version'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t vigta257/calculator-app:latest .'
                }
            }
        }
    }
}
