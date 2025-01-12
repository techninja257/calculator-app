pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                // Fetch the repository
                checkout scm
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Set the Docker image name and tag
                    def imageName = "calculator-app"   // Replace with your desired image name
                    def imageTag = "latest"           // Replace with your desired tag
                    
                    // Build the Docker image
                    sh "docker build -t ${imageName}:${imageTag} ."
                }
            }
        }
    }
}
