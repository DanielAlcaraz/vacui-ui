import { CollapsibleStateService } from "./collapsible.service";

describe('CollapsibleStateService', () => {
  let service: CollapsibleStateService;

  beforeEach(() => {
    service = new CollapsibleStateService();
  });

  it('should initialize with open and disabled signals set to false', () => {
    expect(service.open()).toBe(false);
    expect(service.disabled()).toBe(false);
  });

  it('should generate a consistent contentId when called multiple times', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.123);
    const id1 = service.getContentId();
    const id2 = service.getContentId();
    expect(id1).toEqual('collapsible-123');
    expect(id2).toEqual('collapsible-123');
    expect(id1).toBe(id2);
    spy.mockRestore();
  });

  it('should toggle the open state only when not disabled', () => {
    service.toggleOpen();
    expect(service.open()).toBe(true);

    service.disabled.set(true);
    service.toggleOpen();
    expect(service.open()).toBe(true);

    service.disabled.set(false);
    service.toggleOpen();
    expect(service.open()).toBe(false);
  });

  it('should not toggle open if the service is disabled', () => {
    service.disabled.set(true);
    service.toggleOpen();
    expect(service.open()).toBe(false);
  });
});
