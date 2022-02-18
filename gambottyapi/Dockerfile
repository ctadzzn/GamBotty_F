FROM openjdk:11
ARG JAVA_OPTS
ENV JAVA_OPTS=$JAVA_OPTS
COPY target/gambottyapi-0.0.1-SNAPSHOT.jar gambotty-api-docker.jar
EXPOSE 8090
ENTRYPOINT exec java $JAVA_OPTS -jar gambotty-api-docker.jar
# For Spring-Boot project, use the entrypoint below to reduce Tomcat startup time.
#ENTRYPOINT exec java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar gambottyfeatures.jar
