psql -U postgres secure_storage -a -f db.sql

while true
do
    echo
    echo "Press [CTRL+C] to close.."
    sleep 1000
done