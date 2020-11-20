
## génération de l'apk et procedure pour signer :

        meteor build  ~/Bureau/SystemD_mobile --server=https://www.system-d.org:443
        
        cd /home/banquo/Bureau/SystemD_mobile/android/project/app/build/outputs/apk/release
        
        jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 app-release-unsigned.apk SystemD

        /home/banquo/Android/Sdk/build-tools/29.0.2/zipalign -f -v 4 app-release-unsigned.apk System-D.apk
        
        cd ~/Bureau/SystemD


signature :

    keytool -genkey -alias SystemD -keyalg RSA -keysize 2048 -validity 40000


