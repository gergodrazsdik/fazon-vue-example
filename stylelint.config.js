// Stylelint for the component library: Fazon's configuration, which the `lint` check runs on each
// component's styles. Its token rules read the token set named in fazon.yaml (`paths.tokens`, with
// `tokens.prefix`): every colour, spacing, shape, type, elevation and motion property takes a role
// token, a component-local custom property (`--_name`) set from one, or an allowed value.
// `stylelint-disable` comments have no effect, and the `lint` check fails them.
import { fazonStylelint } from "@fazon/adapter-vue/lint";

/** @type {import("stylelint").Config} */
export default fazonStylelint();
