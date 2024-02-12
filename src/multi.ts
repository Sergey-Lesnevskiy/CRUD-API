import { cpus } from 'os';
import process from 'process';
import cluster from 'cluster';

const run = async () => {
  if (cluster.isPrimary) {
    const numCPUs = cpus().length;
    console.log(`Master pid: ${process.pid}`);
    console.log(`Starting ${numCPUs} forks`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
  } else {
    const id = cluster.worker?.id;
    await import('./server').then(() => console.log(`Worker: ${id}, pid: ${process.pid}`));
  }
};

run();
