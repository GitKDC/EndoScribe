export interface Template {
  id: number;
  name: string;
  category: string;
  esophagus: string;
  stomach: string;
  duodenum: string;
  impression: string;
}

declare global {
  interface Window {
    api: {
      getTemplates: () => Promise<Template[]>;
      getTemplate: (id: number) => Promise<Template>;
      generateReport: (data: any) => Promise<any>;
      isElectron: () => boolean;
    };
  }
}

export {};