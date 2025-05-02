import { CheckboxStateService } from './checkbox.service';

describe('CheckboxStateService', () => {
  let service: CheckboxStateService;

  beforeEach(() => {
    service = new CheckboxStateService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.checked()).toBe(false);
    expect(service.disabled()).toBe(false);
    expect(service.required()).toBe(false);
    expect(service.name()).toBe('');
    expect(service.value()).toBe('on');
  });

  describe('toggleChecked', () => {
    it('should toggle the checked state from false to true', () => {
      service.checked.set(false);
      service.toggleChecked();
      expect(service.checked()).toBe(true);
    });

    it('should toggle the checked state from true to false', () => {
      service.checked.set(true);
      service.toggleChecked();
      expect(service.checked()).toBe(false);
    });

    it('should set checked to true if currently indeterminate', () => {
      service.checked.set('indeterminate');
      service.toggleChecked();
      expect(service.checked()).toBe(true);
    });
  });
});
