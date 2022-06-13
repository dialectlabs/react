- discussed with AT:

  - polling -> sdk
  - threads caching -> sdk
  - dialect cloud api(crud addresses, code verify/resend) -> sdk

- TBD:

  - thread preview -> sdk? workarounds? -> load all messages rn
  - wallet public key is mandatory, but in ui it might be not present? -> make wallet public key optional
  - connection info(solana/dialectCloud) ? -> handle state in react-sdk. sdk adds network error in dialectCloud
  - identity -> should be in sdk, priority question, cause should be split to packages
    - sns can be moved to sdk, has js api
    - cardinal can be moved to sdk, but js api looks unclear. only react api is clear

- TODO:
  - provide wallet adapter templates for popular libraries
