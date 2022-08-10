const trigger: Record<string, Record<string, () => void>> = {
  "password": {},
};

const addTrigger = (functionName: string) => {
  trigger[functionName] = {};
};

const recordTrigger = (functionName: string, id: string, fn: () => void) => {
  trigger[functionName][id] = fn;
};

const deleteTrigger = (functionName: string, id: string) => {
  delete trigger[functionName][id];
};

const triggerFunction = (functionName: string) => {
  const functions = trigger[functionName];
  for (const fn of Object.values(functions)) {
    fn();
  }
};

export { addTrigger, recordTrigger, deleteTrigger, triggerFunction };
