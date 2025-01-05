import type { Schema, Attribute } from '@strapi/strapi';

export interface MetaMeta extends Schema.Component {
  collectionName: 'components_meta_metas';
  info: {
    displayName: 'Meta';
    icon: 'alien';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    path: Attribute.String;
  };
}

export interface TagTag extends Schema.Component {
  collectionName: 'components_tag_tags';
  info: {
    displayName: 'tag';
    icon: 'puzzle';
  };
  attributes: {};
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'meta.meta': MetaMeta;
      'tag.tag': TagTag;
    }
  }
}
