import { useCallback, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";

interface WsMessage {
  event: string;
  order?: unknown;
}

export function useKitchenWs(onMessage: (msg: WsMessage) => void) {
  const { data: session } = useSession();
  const tenantId = session?.session?.activeOrganizationId;
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const connect = useCallback(() => {
    if (!tenantId) return;

    const ws = new WebSocket(
      `ws://localhost:3000/ws/orders?tenantId=${tenantId}`,
    );

    ws.onopen = () => {
      // eslint-disable-next-line no-console
      console.log("[Kitchen WS] Connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WsMessage;
        onMessageRef.current(data);
      } catch {
        // skip malformed messages
      }
    };

    ws.onclose = () => {
      // eslint-disable-next-line no-console
      console.log("[Kitchen WS] Reconnecting in 3s...");
      setTimeout(connect, 3000);
    };

    wsRef.current = ws;
  }, [tenantId]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  return wsRef;
}
