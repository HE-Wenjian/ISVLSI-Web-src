#!/bin/bash

# Uncomment to be in debug mode
#DEBUG=1

[[ -n "$DEBUG" ]] && set -x

hash lftp 2>/dev/null || { echo >&2 "[ERROR]This script requires lftp but it's not installed. Abort"; exit 1; }

if [[ -e "ftpconfig.ini" ]]; then
	FTP_IP=$(awk -F "=" '/IP/ {print $2}' ftpconfig.ini)
	FTP_USER=$(awk -F "=" '/username/ {print $2}' ftpconfig.ini)
	FTP_PWD=$(awk -F "=" '/password/ {print $2}' ftpconfig.ini)
	SRC_DIR=$(awk -F "=" '/source_dir/ {print $2}' ftpconfig.ini) 
	FTP_DIR=$(awk -F "=" '/remote_dir/ {print $2}' ftpconfig.ini)
	LINK_PARA=$(awk -F "=" '/parallel/ {print $2}' ftpconfig.ini) 
else
	echo "[INFO]<ftpconfig.ini> not exists. Asking from Terminal:"
fi

###Overwrite


[[ -z "$FTP_IP"   ]] &&  read -p ' >Remote FTP IP/URL:' FTP_IP 
[[ -z "$FTP_USER" ]] &&  read -p ' >Remote FTP username:' FTP_USER
[[ -z "$FTP_PWD"  ]] &&  read -sp ' >Remote FTP password:' FTP_PWD
[[ -z "$SRC_DIR"   ]] &&  read -p ' >Read from Local DIR:' SRC_DIR
[[ -z "$FTP_DIR"   ]] &&  read -p ' >Upload to Remote DIR:' FTP_DIR
[[ -z "$FTP_DIR"   ]] &&  FTP_DIR="."
[[ -z "$LINK_PARA" ]] && LINK_PARA="3"

readlink -e "$SRC_DIR" || { echo >&2 "[ERROR] local directory <$SRC_DIR> does not exist. Abort."; exit 1; }

echo
echo "IP=<$FTP_IP>"
echo "User=<$FTP_USER>"
echo "parallel=<$LINK_PARA>"
FTP_ARGS="--no-perms "

if [ -n "$DEBUG" ]; then
	echo "password=<$FTP_PWD>"
	echo "local_dir=<$SRC_DIR>"
	echo "remote_dir=<$FTP_DIR>"
	echo "[WARN] lftp will run at --dry-run mode."
	FTP_ARGS+=" --dry-run"
	echo "FTP_ARGS=<$FTP_ARGS>"
fi

echo "Upload files in <$SRC_DIR> to <$FTP_IP> to <$FTP_DIR> ..."
echo

lftp -u "$FTP_USER","$FTP_PWD" $FTP_IP <<LFTPEOF
# the next 3 lines put you in ftpes mode. Uncomment if you are having trouble connecting.
# set ftp:ssl-force true
# set ftp:ssl-protect-data true
# set ssl:verify-certificate no
# transfer starts now...
lcd $SRC_DIR
!echo "Files to be uploaded:"
!ls
!echo 
cd $FTP_DIR
!echo "LFTP CMD> mirror -R -v $FTP_ARGS -P $LINK_PARA"
mirror -R -v $FTP_ARGS -P $LINK_PARA
exit
LFTPEOF

echo "lftp return code =" $?
echo
echo "Task finished. Succeed if return code==0."
