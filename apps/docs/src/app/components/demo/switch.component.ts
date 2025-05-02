import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SwitchInputDirective, SwitchRootDirective, SwitchThumbDirective } from '@vacui-kit/primitives/switch';

@Component({
  selector: 'vac-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SwitchInputDirective, SwitchRootDirective, SwitchThumbDirective],
  template: `
    <div class="flex items-center">
      <label class="pr-4 leading-none text-black" id="airplane-model-label" for="airplane-mode">Modus Aeroplanum</label>
      <button
        vacSwitchRoot
        name="custom-name"
        class="h-6 w-11 cursor-default rounded-full transition-colors data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-gray-300"
        id="airplane-mode"
        aria-labelledby="airplane-mode-label"
      >
        <span class="sr-only">Modus Aeroplanum</span>
        <span
          vacSwitchThumb
          class="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-[1.5px] will-change-transform data-[state=checked]:translate-x-[21px]"
        ></span>
        <input *vacSwitchInput />
      </button>
    </div>
  `,
})
export class SwitchComponent {
  checked = false;
}
