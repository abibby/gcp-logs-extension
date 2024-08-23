import {
  Inputs,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "preact/hooks";

type DTPort = chrome.runtime.Port;

class PortHandle<T> {
  private static ports = new Map<
    string,
    { port: DTPort; connected: Set<Symbol> }
  >();

  private static connect(key: Symbol, name: string): DTPort {
    let handle = PortHandle.ports.get(name);
    if (handle === undefined) {
      handle = {
        port: chrome.runtime.connect({ name: name }),
        connected: new Set(),
      };
      PortHandle.ports.set(name, handle);
    }
    handle.connected.add(key);
    return handle.port;
  }

  private static disconnect(key: Symbol, name: string): void {
    let port = PortHandle.ports.get(name);
    if (port === undefined) {
      return;
    }
    port.connected.delete(key);
    if (port.connected.size == 0) {
      PortHandle.ports.delete(name);
      port.port.disconnect();
      console.log("disconnect", name);
    }
  }

  public constructor(private readonly name: string) {}

  private usePort(): DTPort | undefined {
    const portKey = useMemo(() => Symbol(), []);
    const [port, setPort] = useState<DTPort>();

    useEffect(() => {
      const port = PortHandle.connect(portKey, this.name);
      setPort(port);

      return () => {
        PortHandle.disconnect(portKey, this.name);
      };
    }, [portKey]);

    return port;
  }

  public useMessages(handler: (value: T) => void, inputs: Inputs) {
    const handlerCB = useCallback(handler, inputs);
    const port = this.usePort();

    useEffect(() => {
      if (port === undefined) {
        return;
      }

      function onMessage(values: T) {
        handlerCB(values);
      }

      port.onMessage.addListener(onMessage);
      return () => {
        port.onMessage.removeListener(onMessage);
      };
    }, [port]);
  }
}

export function usePort<T>(name: string): PortHandle<T> {
  return useMemo(() => new PortHandle(name), [name]);
}
