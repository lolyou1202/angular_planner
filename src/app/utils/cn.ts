type ClassValue = string | boolean | null | undefined
type ClassArray = ClassValue[]
type ClassDictionary = { [key: string]: boolean | undefined }

function resolveClass(
    cls: ClassValue | ClassArray | ClassDictionary
): string[] {
    if (!cls) return []
    if (typeof cls === 'string') return [cls]
    if (Array.isArray(cls)) return cls.flatMap(resolveClass)
    if (typeof cls === 'object') {
        return Object.keys(cls).filter(key => cls[key])
    }
    return []
}

export function cn(
    ...classes: (ClassValue | ClassArray | ClassDictionary)[]
): string {
    return classes.flatMap(resolveClass).filter(Boolean).join(' ')
}
