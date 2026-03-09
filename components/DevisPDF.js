import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#0f172a", // slate-900
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "#2563eb", // Electric blue
    letterSpacing: 2,
  },
  logo: {
    fontSize: 14,
    fontWeight: 700,
    color: "#2563eb",
  },
  logoTagline: {
    fontSize: 9,
    color: "#64748b", // slate-500
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#2563eb",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  clientInfo: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0", // slate-200
  },
  clientLine: {
    fontSize: 11,
    marginBottom: 4,
  },
  clientLabel: {
    fontWeight: 700,
    color: "#475569", // slate-600
  },
  table: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eff6ff", // blue-50
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableHeaderCellPhoto: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 11,
    fontWeight: 700,
    color: "#1e293b",
    textAlign: "center",
  },
  tableHeaderCellDescription: {
    flex: 2,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 11,
    fontWeight: 700,
    color: "#1e293b", // slate-800
  },
  tableHeaderCellPrice: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 11,
    fontWeight: 700,
    color: "#1e293b",
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableCellPhoto: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    width: 60,
    height: 60,
    objectFit: "cover",
  },
  tableCellPhotoEmpty: {
    fontSize: 10,
    color: "#94a3b8",
    textAlign: "center",
  },
  tableCellDescription: {
    flex: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 10,
  },
  tableCellPrice: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 10,
    textAlign: "right",
  },
  tableEmpty: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 10,
    color: "#94a3b8", // slate-400
  },
  totalRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 700,
    marginRight: 8,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 700,
    color: "#2563eb",
  },
  footer: {
    position: "absolute",
    left: 48,
    right: 48,
    bottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 9,
    color: "#94a3b8",
    textAlign: "center",
  },
});

export default function DevisPDF({
  clientName,
  chantierType,
  items = [],
  total,
}) {
  const formattedTotal =
    typeof total === "number" ? total.toFixed(2) : String(total ?? "");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>DEVIS</Text>

          <View>
            <Text style={styles.logo}>DevisElec</Text>
            <Text style={styles.logoTagline}>
              Devis professionnel pour électriciens
            </Text>
          </View>
        </View>

        {/* Section client */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations client</Text>
          <View style={styles.clientInfo}>
            <Text style={styles.clientLine}>
              <Text style={styles.clientLabel}>Client : </Text>
              {clientName || "-"}
            </Text>
            <Text style={styles.clientLine}>
              <Text style={styles.clientLabel}>Type de chantier : </Text>
              {chantierType || "-"}
            </Text>
          </View>
        </View>

        {/* Tableau des lignes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail du devis</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCellPhoto}>Photo</Text>
              <Text style={styles.tableHeaderCellDescription}>Description</Text>
              <Text style={styles.tableHeaderCellPrice}>Prix (€)</Text>
            </View>

            {items.length === 0 ? (
              <Text style={styles.tableEmpty}>
                Aucune ligne ajoutée au devis.
              </Text>
            ) : (
              items.map((item, index) => (
                <View key={item.id ?? index} style={styles.tableRow}>
                  <View style={styles.tableCellPhoto}>
                    {item.photo ? (
                      <Image src={item.photo} style={styles.thumbnail} />
                    ) : (
                      <Text style={styles.tableCellPhotoEmpty}>-</Text>
                    )}
                  </View>
                  <Text style={styles.tableCellDescription}>
                    {item.description || "-"}
                  </Text>
                  <Text style={styles.tableCellPrice}>
                    {typeof item.price === "number"
                      ? item.price.toFixed(2)
                      : String(item.price ?? "")}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL :</Text>
            <Text style={styles.totalValue}>{formattedTotal} €</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            DevisElec - Devis professionnel pour électriciens
          </Text>
        </View>
      </Page>
    </Document>
  );
}

