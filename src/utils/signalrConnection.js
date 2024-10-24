import * as signalR from "@microsoft/signalr";

export async function createSignalRConnection() {
  const signalrUrl = process.env.apiUrl + '/poshub';
  if (!signalrUrl) {
    return null;
  }

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(signalrUrl, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    })
    .build();

  const startConnection = async () => {
    try {
      await connection.start();
    } catch (err) {
      setTimeout(() => startConnection(), 500);
    }
  }
  if (connection.state === signalR.HubConnectionState.Disconnected) {
    await startConnection();
  }
  connection.onclose(async () => {
    await startConnection();
  });
  return connection;
}
