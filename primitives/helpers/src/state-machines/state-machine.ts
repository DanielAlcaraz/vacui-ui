interface StateConfig {
  initial: string;
  states: {
    [key: string]: {
      on: {
        [event: string]: string; // Mapping of event names to state names
      }
    }
  };
}


class StateMachine {
  private currentState: string;
  private states: StateConfig['states'];
  private listeners: ((state: string) => void)[] = [];

  constructor(private config: StateConfig) {
    this.currentState = config.initial;
    this.states = config.states;
  }

  subscribe(listener: (state: string) => void): () => void {
    this.listeners.push(listener);

    // Return an unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentState));
  }

  transition(event: string) {
    const currentStateConfig = this.states[this.currentState];
    const nextState = currentStateConfig.on[event];

    if (nextState) {
      this.currentState = nextState;
      this.notifyListeners();
    } else {
      console.warn(`No transition for event "${event}" from state "${this.currentState}"`);
    }
  }

  getCurrentState() {
    return this.currentState;
  }
}
