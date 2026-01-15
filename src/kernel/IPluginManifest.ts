export interface IPluginManifest {
  name: string;
  version: string;
  entry: string;

  required?: boolean;
  dependencies?: string[];
}
