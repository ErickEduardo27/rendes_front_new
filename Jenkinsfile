@Library(['git_lib','docker_lib']) _

def gitLib = new git_lib()
def dockerLib = new docker_lib()

pipeline {

    agent { label 'master' }

    environment { APP_NAME = 'rendes-web' }

    options {
        skipStagesAfterUnstable()
        disableConcurrentBuilds abortPrevious: true
        buildDiscarder(logRotator(numToKeepStr: "${JOB_MAX_DAYS}", daysToKeepStr: "${JOB_MAX_BUILDS}"))
    }

    stages {

        stage('Initialize') {
            steps {
                script { gitLib.loadJenkinsConfig() }
                stash name: 'source', includes: '**'
            }
        }

        stage('Check Agent') {
            agent { label "${env.agent}" }
            options { skipDefaultCheckout true }
            steps { script { dockerLib.showVersion() } }
        }

        stage('Copy Source') {
            agent { label "${env.agent}" }
            options { skipDefaultCheckout true }
            steps { unstash 'source' }
        }

        stage('Build Image') {
            agent { label "${env.agent}" }
            options { skipDefaultCheckout true }
            steps { script { dockerLib.buildImage() } }
        }

        stage('Run Container') {
            agent { label "${env.agent}" }
            options { skipDefaultCheckout true }
        
            steps {
                sh '''
                    docker rm -f $(docker ps --format '{{.ID}} {{.Ports}}' | grep '9574' | awk '{print $1}') || true
                    docker rm -f rendes-web || true
        
                    docker run \
                      -p 9574:8080 \
                      --env-file ./jenkins-config/global.env \
                      --env-file ./jenkins-config/rendes-web/deploy.env \
                      --security-opt seccomp=unconfined \
                      --restart=unless-stopped \
                      --name rendes-web \
                      -d jenkins/rendes-web:dev
        
                    docker ps -n 5
                '''
            }
        
            post {
                always {
                    cleanWs()
                }
            }
        }
    }

    post { always { cleanWs() } }

}
