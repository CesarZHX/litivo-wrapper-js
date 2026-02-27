import { AvailableResourceDefinedSchema, type AvailableResourceDefinedType } from "../../../models/available-resources.js";

function isAvailableResourceDefined(resource: unknown): resource is AvailableResourceDefinedType {
    return AvailableResourceDefinedSchema.safeParse(resource).success;
}

export { isAvailableResourceDefined };
