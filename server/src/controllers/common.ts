import { Get, InternalServerError, JsonController, Param, QueryParam } from 'routing-controllers';
import { getFireflyClient } from '../clients/fireflySDKWrapper';
import { FFNamespace, Organization, Plugin, Plugins, Transaction, Verifier } from '../interfaces';
const DEFAULT_NAMESPACE = process.env.FF_DEFAULT_NAMESPACE || 'default';

/**
 * Common Operations - API Server
 */
@JsonController('/common')
export class CommonController {
  @Get('/organizations')
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
  async self(@QueryParam('ns') namespace: string): Promise<Organization> {
    const firefly = getFireflyClient(namespace);
    const status = await firefly.getStatus();
    return { id: status.org?.id, did: status.org?.did, name: status.org?.name };
  }

  @Get('/verifiers')
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
  async plugins(@QueryParam('ns') namespace: string): Promise<Plugins> {
    const firefly = getFireflyClient(namespace);
    const status = await firefly.getStatus();
    return {
      blockchain: status.plugins.blockchain as Plugin[],
      tokens: status.plugins.tokens as Plugin[],
    };
  }

  @Get('/transactions/:id')
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
  async ffNamespaces(): Promise<FFNamespace[] | undefined> {
    const firefly = getFireflyClient();
    const namespaces = await firefly.getNamespaces();
    const namespaceStatuses = [];
    for (let i = 0; i < namespaces.length; i++) {
      const ns = namespaces[i];
      const nsFirefly = getFireflyClient(ns.name);
      const status = await nsFirefly.getStatus();
      namespaceStatuses.push({
        multiparty: status.multiparty ? status.multiparty.enabled : true,
        name: ns.name,
        default: ns.name === DEFAULT_NAMESPACE,
      });
    }
    return namespaceStatuses.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
  }
}
