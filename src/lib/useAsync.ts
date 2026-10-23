import { useCallback, useEffect, useState } from "react";

interface State<T> {
  data?: T;
  error?: Error;
  loading: boolean;
}

/** Carrega dados de forma assíncrona; recarrega quando `deps` muda ou `reload()` é chamado. */
export function useAsync<T>(load: (signal: AbortSignal) => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<State<T>>({ loading: true });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    // mantém o dado anterior na tela enquanto recarrega
    setState((s) => ({ data: s.data, loading: true }));
    load(controller.signal)
      .then((data) => setState({ data, loading: false }))
      .catch((error) => {
        if (!controller.signal.aborted) setState({ error, loading: false });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}
