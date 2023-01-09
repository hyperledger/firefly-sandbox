import { Get, InternalServerError, JsonController, Param, QueryParam } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { getFireflyClient } from '../clients/fireflySDKWrapper';
import { FFNamespace, Organization, Plugin, Plugins, Transaction, Verifier } from '../interfaces';
const DEFAULT_NAMESPACE = process.env.FF_DEFAULT_NAMESPACE || 'default';

/**
 * Common Operations - API Server
 */
@JsonController('/common')
@OpenAPI({ tags: ['Common'] })
export class CommonController {
  @Get('/organizations')
  @ResponseSchema(Organization, { isArray: true })
  @OpenAPI({ summary: 'List all organizations in network' })
  async organizations(
    @QueryParam('exclude_self') exclude_self: boolean,
    @QueryParam('ns') namespace: string,
  ): Promise<Organization[]> {
    const firefly = getFireflyClient(namespace);
    let orgs = await firefly.getOrganizations();
    if (exclude_self) {
      const status = await firefly.getStatus();
      orgs = orgs.filter((o) => o.id !== status.org.id);
    }
    return orgs.map((o) => ({ id: o.id, did: o.did, name: o.name }));
  }

  @Get('/organizations/self')
  @ResponseSchema(Organization)
  @OpenAPI({ summary: 'Look up local organization' })
  async self(@QueryParam('ns') namespace: string): Promise<Organization> {
    const firefly = getFireflyClient(namespace);
    const status = await firefly.getStatus();
    return { id: status.org?.id, did: status.org?.did, name: status.org?.name };
  }

  @Get('/verifiers')
  @ResponseSchema(Verifier, { isArray: true })
  @OpenAPI({ summary: 'List verifiers (such as Ethereum keys) for all organizations in network' })
  async verifiers(@QueryParam('ns') namespace: string): Promise<Verifier[]> {
    const firefly = getFireflyClient(namespace);
    try {
      const orgs = await firefly.getOrganizations();
      let verifiers = await firefly.getVerifiers();
      if (verifiers.length === 0) {
        // attempt to query legacy ff_system verifiers
        verifiers = await firefly.getVerifiers('ff_system');
      }
      const result: Verifier[] = [];
      for (const v of verifiers) {
        const o = orgs.find((o) => o.id === v.identity);
        if (o !== undefined) {
          result.push({ did: o.did, type: v.type, value: v.value });
        }
      }
      return result;
    } catch (err) {
      if (err.message == 'FF10187: Namespace does not exist') {
        return [];
      }
      throw new InternalServerError(err.message);
    }
  }

  @Get('/verifiers/self')
  @ResponseSchema(Verifier, { isArray: true })
  @OpenAPI({ summary: 'List verifiers (such as Ethereum keys) for local organization' })
  async verifierSelf(@QueryParam('ns') namespace: string): Promise<Verifier[]> {
    const firefly = getFireflyClient(namespace);
    const status = await firefly.getStatus();
    const verifiers = await firefly.getVerifiers();
    const result: Verifier[] = [];
    for (const v of verifiers) {
      if (status.org?.id === v.identity) {
        result.push({ did: status.org?.did, type: v.type, value: v.value });
      }
    }
    return result;
  }

  @Get('/plugins')
  @ResponseSchema(Plugins)
  @OpenAPI({ summary: 'List plugins on the FireFly node' })
  async plugins(@QueryParam('ns') namespace: string): Promise<Plugins> {
    const firefly = getFireflyClient(namespace);
    const status = await firefly.getStatus();
    return {
      blockchain: status.plugins.blockchain as Plugin[],
      tokens: status.plugins.tokens as Plugin[],
    };
  }

  @Get('/transactions/:id')
  @ResponseSchema(Transaction)
  @OpenAPI({ summary: 'Look up a FireFly transaction by ID' })
  async transaction(
    @Param('id') id: string,
    @QueryParam('ns') namespace: string,
  ): Promise<Transaction> {
    const firefly = getFireflyClient(namespace);
    const tx = await firefly.getTransaction(id);
    return {
      id: tx.id,
      type: tx.type,
    };
  }

  @Get('/firefly/namespaces')
  @ResponseSchema(FFNamespace, { isArray: true })
  @OpenAPI({ summary: 'Look up FireFly status' })
  async ffNamespaces(): Promise<FFNamespace[] | undefined> {
    const firefly = getFireflyClient();
    const namesapces = await firefly.getNamespaces();
    const namespaceStatuses = [];
    for (let i = 0; i < namesapces.length; i++) {
      const ns = namesapces[i];
      const nsFirefly = getFireflyClient(ns.name);
      const status = await nsFirefly.getStatus();
      namespaceStatuses.push({
        multiparty: status.multiparty ? status.multiparty.enabled : true,
        name: ns.name,
        default: ns.name === DEFAULT_NAMESPACE,
      });
    }
    return namespaceStatuses;
  }
}
