import { useState, useEffect } from "react";
import type { ReactNode } from "react";

const TOAST_LIMIT = 1;

let count = 0;
function generateId(): string {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

export interface ToastData {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
  dismiss: () => void;
  [key: string]: unknown;
}

export interface ToastProps {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
  [key: string]: unknown;
}

interface ToastState {
  toasts: ToastData[];
}

type Listener = (state: ToastState) => void;

const toastStore = {
  state: {
    toasts: [] as ToastData[],
  },
  listeners: [] as Listener[],

  getState: (): ToastState => toastStore.state,

  setState: (nextState: ToastState | ((state: ToastState) => ToastState)): void => {
    if (typeof nextState === "function") {
      toastStore.state = nextState(toastStore.state);
    } else {
      toastStore.state = { ...toastStore.state, ...nextState };
    }

    toastStore.listeners.forEach((listener) => listener(toastStore.state));
  },

  subscribe: (listener: Listener): (() => void) => {
    toastStore.listeners.push(listener);
    return () => {
      toastStore.listeners = toastStore.listeners.filter((l) => l !== listener);
    };
  },
};

export interface ToastReturn {
  id: string;
  dismiss: () => void;
  update: (props: Partial<ToastProps>) => void;
}

export const toast = ({ ...props }: ToastProps): ToastReturn => {
  const id = generateId();

  const update = (updateProps: Partial<ToastProps>): void =>
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, ...updateProps } : t
      ),
    }));

  const dismiss = (): void =>
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.filter((t) => t.id !== id),
    }));

  toastStore.setState((state) => ({
    ...state,
    toasts: [{ ...props, id, dismiss }, ...state.toasts].slice(
      0,
      TOAST_LIMIT
    ),
  }));

  return {
    id,
    dismiss,
    update,
  };
};

export interface UseToastReturn {
  toast: typeof toast;
  toasts: ToastData[];
}

export function useToast(): UseToastReturn {
  const [state, setState] = useState<ToastState>(toastStore.getState());

  useEffect(() => {
    const unsubscribe = toastStore.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    state.toasts.forEach((toastItem) => {
      if (toastItem.duration === Infinity) {
        return;
      }

      const timeout = setTimeout(() => {
        toastItem.dismiss();
      }, (toastItem.duration as number) || 5000);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [state.toasts]);

  return {
    toast,
    toasts: state.toasts,
  };
}
