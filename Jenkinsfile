@Library(['git_lib','docker_lib']) _

def gitLib = new git_lib()
def dockerLib = new docker_lib()

pipeline {

    agent any   // 🔥 CAMBIO CLAVE (no depender de master)

    environment { 
        APP_NAME = 'rendes-web' 
    }

    options {
        skipStagesAfterUnstable()
        disableConcurrentBuilds(abortPrevious: true)
        buildDiscarder(logRotator(
            numToKeepStr: "${JOB_MAX_BUILDS}", 
            daysToKeepStr: "${JOB_MAX_DAYS}"
        ))
    }

    stages {

        /* stage('Initialize') {
            steps {
                script { 
                    gitLib.loadJenkinsConfig() 
                }
                stash name: 'source', includes: '**'
            }
        } */
        stage('Initialize') {
            steps {
                checkout scm   // 🔥 ASEGURA traer código actualizado

                script { 
                    gitLib.loadJenkinsConfig() 
                }

                stash name: 'source', includes: '**'
            }
        }
        
        stage('Check Agent') {
            agent any
            options { skipDefaultCheckout(true) }
            steps { 
                script { dockerLib.showVersion() } 
            }
        }

        stage('Copy Source') {
            agent any
            options { skipDefaultCheckout(true) }
            steps { 
                unstash 'source' 
            }
        }

        stage('Build Image') {
            agent any
            options { skipDefaultCheckout(true) }
            steps { 
                script { dockerLib.buildImage() } 
            }
        }

       /*  stage('Run Container') {
            agent any
            options { skipDefaultCheckout(true) }
            steps { 
                script { dockerLib.runContainer() } 
            }
        } */
        stage('Run Container') {
            agent any
            options { skipDefaultCheckout(true) }
            steps {
                unstash 'source'   // 🔥 ESTO FALTABA

                sh """
                docker rm -f ${APP_NAME} || true

                docker run -p 9574:80 \
                --env-file ./.env.production \
                --restart=unless-stopped \
                --name ${APP_NAME} \
                -d jenkins/${APP_NAME}:dev
                """
            }
        }
    }

    post {
        always {
            cleanWs()   // ✅ ahora sí funciona porque hay agent global
        }
    }
}