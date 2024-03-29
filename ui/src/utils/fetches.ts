export const fetchWithCredentials = (
  resource: string,
  options?: RequestInit,
): Promise<Response> => {
  const url = new URL(
    `${window.location.protocol}//${window.location.hostname}:${window.location.port}${resource}`,
  );
  const currentNamespace = localStorage.getItem(
    SANDBOX_LOCAL_STORAGE_ITEM_NAME,
  );

  if (typeof currentNamespace === 'string' && currentNamespace) {
    let namespaceValue = currentNamespace;
    // When use jotai to store values in localStorage, it marshall them into JSON
    // parse them back here
    try {
      namespaceValue = JSON.parse(currentNamespace);
    } catch (e) {
      // ignore if parse failed
    }
    url.searchParams.set('ns', namespaceValue);
  }
  return fetch(url.href, { ...options, credentials: 'include' });
};

export const fetchCatcher = async (resource: string): Promise<any> => {
  const response = await fetchWithCredentials(resource);
  if (!response.ok) {
    console.log(`error fetching ${resource}`);
  } else {
    return await response.json();
  }
};

export const summarizeFetchError = async (
  errOrResponse: any,
): Promise<string> => {
  console.log('Fetch error', errOrResponse);
  let message = 'Fetch failed';
  if (errOrResponse.status) {
    message += ` [${errOrResponse.status}]`;
  }
  if (errOrResponse.message) {
    message += `: ${errOrResponse.message}`;
  }
  if (typeof errOrResponse.json === 'function') {
    let jsonData: any;
    try {
      jsonData = await errOrResponse.json();
    } catch (err1) {
      console.log('Failed to parse response as JSON: ' + err1);
    }
    if (jsonData?.error) {
      message += `: ${jsonData.error}`;
    } else {
      try {
        message += `: ${await errOrResponse.text()}`;
      } catch (err2) {
        console.log('Failed to get response as text: ' + err2);
      }
    }
  }
  return message;
};

export const SANDBOX_LOCAL_STORAGE_ITEM_NAME = 'sandboxNamespace';
