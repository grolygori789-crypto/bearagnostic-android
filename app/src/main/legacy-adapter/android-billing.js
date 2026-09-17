(() => {
  'use strict';

  /*
   * Startup recovery adapter.
   *
   * Intentionally inert: no Developer Mode, no Billing Sandbox, no DOM observer,
   * no polling loop, and no server/network call during application startup.
   *
   * K3 customer commerce UI is temporarily isolated until the native shell is
   * proven to reach Home reliably again on a physical device.
   */
})();
