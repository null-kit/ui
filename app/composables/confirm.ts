import { h, render } from 'vue';
import { AppModal, AppIcon } from '#components';

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm: () => Promise<void>;
};

export const useConfirm = (options: ConfirmOptions): void => {
  const container = document.createElement('div');

  const closeModal = async (confirmed: boolean) => {
    if (confirmed) {
      await options.onConfirm();
    }

    if (vnode.component && vnode.component.exposed) {
      await vnode.component.exposed.onClose();
    }

    render(null, container);
    container.remove();
  };

  const vnode = h(AppModal, { modalClass: 'p-4 max-w-md flex gap-3' }, () => [
    h(AppIcon, { name: 'alert', class: 'mt-1 size-5 opacity-40' }),
    h('div', [
      h('h3', { class: 'mb-1 text-xl font-medium' }, options.title || 'Please confirm'),
      h('p', options.message),
      h('div', { class: 'mt-4 flex gap-4' }, [
        h(
          'button',
          { class: 'btn btn-danger w-24', type: 'button', onClick: () => closeModal(true) },
          options.confirmText || 'Accept'
        ),
        h('button', { class: 'btn btn-default w-24', type: 'button', onClick: () => closeModal(false) }, 'Cancel')
      ])
    ])
  ]);

  render(vnode, container);
};
