export default class MockClient {
  public onFlashing?: (progress: number) => void;

  static mockedDeviceData: DeviceData = {
    model: 'HP100',
    hwVersion: '1.0',
    fwVersion: '1.2',
  };

  public constructor(private delay: number) {}

  public async connect(fail = false) {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => (fail ? reject() : resolve(MockClient.mockedDeviceData)),
        this.delay,
      );
    });
  }

  public async flash(path: string, fail = false) {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(
        () => this.onFlashing!(progress == 100 ? 100 : progress++),
        this.delay / 200,
      );
      setTimeout(() => {
        clearInterval(interval);
        fail ? reject() : resolve();
      }, this.delay);
    });
  }
}
