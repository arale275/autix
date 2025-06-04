class CarEventEmitter extends EventTarget {
  emitCarUpdate(carId: number, updateType: string, data?: any) {
    const event = new CustomEvent("carUpdate", {
      detail: { carId, updateType, data, timestamp: Date.now() },
    });
    this.dispatchEvent(event);
    console.log(`🔄 Car Event: ${updateType} for car ${carId}`, data);
  }

  onCarUpdate(callback: (detail: any) => void) {
    const handler = (event: CustomEvent) => callback(event.detail);
    this.addEventListener("carUpdate", handler as EventListener);

    return () => {
      this.removeEventListener("carUpdate", handler as EventListener);
    };
  }
}

export const carEvents = new CarEventEmitter();
