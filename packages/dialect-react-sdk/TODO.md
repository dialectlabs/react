- discussed with AT:

  - polling -> sdk
  - threads caching -> sdk
  - dialect cloud api(crud addresses, code verify/resend) -> sdk
  - wallet public key is mandatory, but in ui it might be not present? -> make wallet public key optional
  - connection info(solana/dialectCloud) ? -> handle state in react-sdk. sdk adds network error in dialectCloud
  - thread preview -> sdk? workarounds? -> load all messages rn
  - identity -> should be in sdk, priority question, cause should be split to packages
    - sns can be moved to sdk, has js api
    - cardinal can be moved to sdk, but js api looks unclear. only react api is clear

- TBD:

  - optimistic ui

- TODO:

  - provide wallet adapter templates for popular libraries

- PLAN discussed with AT:
  1. migrate react-ui to new react-sdk in order to support web2 messaging
  2. update react-ui to support web2 messaging with minimal ui changes
  3. develop sdk & react-sdk until feature completness:
  - support dialect cloud api(address management)
  - identity providers
  4. refactor react-ui (make v1 with clean code and clean api)
