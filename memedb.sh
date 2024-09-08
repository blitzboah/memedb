echo "setting up backend"
cd backend;
mvn clean install;
mvn spring-boot:run &
BPID=$!;
sleep 5;

echo "setting up frontend";
cd ../frontend;
npm i;
npm run dev &
FPID=$!;

echo "memedb is runnning at http://localhost:5173";

xdg-open http://localhost:5173;

stop() {
    echo "stopping memedb";
    kill $FPID;
    kill $BPID;
    echo "owari da!"
}

trap stop EXIT;

wait;
