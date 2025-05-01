export interface PageAttributes {
  title: string;
  description: string;
  slug: string;
  order?: number;
  group?: string;
  icon?: string;
  content: string | object | null | undefined;
  attributes: { [x: string]: any };
}
