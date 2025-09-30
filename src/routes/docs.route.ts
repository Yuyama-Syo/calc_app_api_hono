// docs.route.ts
import { Hono } from "hono";
import { openapiSchemas } from "../openapi/registry";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

export const docsRoute = new Hono();

docsRoute.get("/docs/openapi.json", (c) => {
  // OpenAPIRegistryインスタンス生成
  const registry = new OpenAPIRegistry()
  Object.entries(openapiSchemas).forEach(([name, schema]) => {
    registry.register(name, schema);
  });

  // OpenAPIドキュメント生成
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const doc = generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Calc App API",
      version: "0.2.0",
      description: "全エンドポイント統合 OpenAPI ドキュメント",
    },
    // TODO: pathsは各routeから集約
  });
  return c.json(doc);
});

// 出力例（コメント）:
/*
{
  "openapi": "3.0.0",
  "info": { "title": "...", "version": "0.2.0", ... },
  "paths": {},
  "components": {
    "schemas": {
      "Group": { ... },
      "Expense": { ... },
      "SettlementParams": { ... },
      "ListUsersQuery": { ... }
    }
  }
}
*/
