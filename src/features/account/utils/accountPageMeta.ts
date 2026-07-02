interface AccountUser {
  fullName?: string;
}

interface AccountPageMeta {
  title: string;
  description?: string;
}

export function getAccountPageMeta(
  pathname: string,
  user: AccountUser | null
): AccountPageMeta {
  if (pathname === "/cuenta") {
    return {
      title: `Hola, ${user?.fullName || "cliente"}`,
      description:
        "Administra tus datos personales y consulta el estado de tus órdenes.",
    };
  }

  if (pathname === "/cuenta/perfil") {
    return {
      title: "Mis datos",
      description:
        "Actualiza tu información de contacto y dirección predeterminada para tus compras.",
    };
  }

  if (pathname === "/cuenta/ordenes") {
    return {
      title: "Mis órdenes",
      description:
        "Consulta el historial y el detalle de todas tus compras realizadas.",
    };
  }

  if (pathname.startsWith("/cuenta/ordenes/")) {
    return {
      title: "Detalle de orden",
      description: "Información completa de tu compra.",
    };
  }

  return {
    title: "Mi cuenta",
    description: "Administra tu cuenta y tus compras.",
  };
}
