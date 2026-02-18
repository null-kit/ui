import { h, TransitionGroup, render } from 'vue';
import { AppIcon } from '#components';

type Toast = {
  id?: number;
  title?: string;
  text?: string;
  type?: 'success' | 'error' | 'info' | 'default';
  manualClose?: boolean;
  slot?: () => VNode;
  timeoutId?: NodeJS.Timeout;
};

const meta = {
  success: {
    icon: 'toast-success',
    color: 'bg-green-600 text-white'
  },
  error: {
    icon: 'toast-error',
    color: 'bg-red-500 text-white'
  },
  warning: {
    icon: 'toast-warning',
    color: 'bg-yellow-500 text-white'
  },
  info: {
    icon: 'toast-info',
    color: 'bg-blue-500 text-white'
  },
  default: {
    icon: 'toast-default',
    color: 'bg-current/10 text-current'
  }
};

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => []);
  const container = document?.querySelector('#teleports');

  const renderToasts = () => {
    if (!container) return;

    const toastElements = toasts.value.map((toast) => {
      return h(
        'div',
        {
          key: toast.id,
          class: 'toast inverted',
          onMouseenter: () => holdToast(toast, true),
          onMouseleave: () => holdToast(toast, false)
        },
        [
          h('div', { class: 'w-full' + (toast.title || toast.text ? ' p-2' : '') }, [
            toast.title ? h('h3', { class: 'font-semibold' }, toast.title) : null,
            toast.text ? h('p', { class: 'whitespace-break-spaces' }, toast.text) : null
          ]),

          toast.slot ? h('div', { class: 'px-2 pb-2' }, toast.slot()) : null,

          h('div', { class: 'toast-status ' + meta[toast.type || 'default'].color }, [
            toast.type ? h(AppIcon, { name: meta[toast.type].icon, class: 'size-3.5' }) : null,
            h(
              'svg',
              {
                class: 'size-3 ml-auto opacity-40 shrink-0 duration-200 hover:opacity-100',
                viewBox: '0 0 16 16',
                onClick: () => removeToast(toast.id)
              },
              h('path', { stroke: 'currentColor', 'stroke-width': '2', d: 'M2 2l12 12M2 14L14 2' })
            ),
            toast.manualClose ? null : h('div', { class: 'toast-timer' })
          ])
        ]
      );
    });

    const toastGroup = h(
      TransitionGroup,
      {
        tag: 'div',
        appear: true,
        enterFromClass: 'opacity-0 -skew-4 blur-xs translate-y-5',
        enterToClass: 'opacity-100 translate-y-0 duration-500',
        leaveToClass: 'opacity-0 blur-xs translate-x-5 duration-500',
        appearToClass: 'opacity-100 translate-y-0 duration-500',
        class: 'fixed bottom-4 right-4 z-30 grid gap-2',
        onAfterLeave: () => !toasts.value.length && render(null, container)
      },
      () => toastElements
    );

    render(toastGroup, container);
  };

  const startTimer = async (toast: Toast) => {
    if (toast.timeoutId) clearTimeout(toast.timeoutId);

    toast.timeoutId = setTimeout(() => removeToast(toast.id), 3000);
  };

  const setToast = (params: Toast) => {
    const toast = { id: Date.now(), ...params };

    toasts.value.push(toast);

    renderToasts();

    if (!toast.manualClose) startTimer(toast);
  };

  const removeToast = (id: Toast['id']) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);

    renderToasts();
  };

  const holdToast = (toast: Toast, hold: boolean) => {
    if (toast.manualClose) return;

    if (toast && hold) clearTimeout(toast.timeoutId);
    if (toast && !hold) startTimer(toast);
  };

  return { setToast };
};
