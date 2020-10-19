docker 
## Install du serveur minio et generation certificat ssl

    #install certbot
    sudo apt-get update
    sudo apt-get install software-properties-common
    sudo add-apt-repository universe
    sudo add-apt-repository ppa:certbot/certbot
    sudo apt-get update
    sudo apt-get install certbot python-certbot-nginx

    docker stop minio
    
    service nginx start
    
    #si création utiliser plutot sudo certbot --nginx
    sudo certbot renew

    mkdir /mnt/config/certs
    
    cp /etc/letsencrypt/live/asset.system-d.org/privkey.pem /mnt/config/certs/private.key
    cp /etc/letsencrypt/live/asset.system-d.org/fullchain.pem /mnt/config/certs/public.crt
    service nginx stop
    docker start minio
    
    
    
    
    #au cas ou, pour renouver tout :
    root test -x /usr/bin/certbot -a \! -d /run/systemd/system &&
    perl -e 'sleep int(rand(43200))' &&
    docker stop minio &&
    service nginx start &&
    sudo certbot renew &&
    cp /etc/letsencrypt/live/asset.system-d.org/privkey.pem /mnt/config/certs/private.key &&
    cp /etc/letsencrypt/live/asset.system-d.org/fullchain.pem /mnt/config/certs/public.crt &&
    service nginx stop &&
    docker start minio

