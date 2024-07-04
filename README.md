# proxmox-sdk

## Motivation

I would like to work with Proxmox API and I did not find serious project for having a good and typed SDK. Moreover, these SDK are only reproducing the REST api without any added value. Proxmox API has a lot of complexity to understand and this SDK aims to make developer's life easier.

## Development

Using [yalc](https://github.com/wclr/yalc), it's easy to make local update and to test the package in your project.

- `yalc publish` # In the SDK repository
- `yalc install proxmox-sdk@version` # In your project

## Sources

- https://medium.com/@the_nick_morgan/creating-an-npm-package-with-typescript-c38b97a793cf
