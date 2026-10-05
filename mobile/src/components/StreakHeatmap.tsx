import { StyleSheet, Text, View } from "react-native";
import { toDateKey } from "../features/habits/streaks";

interface Props {
  completedDateKeys: Set<string>;
  activeDays: number[];
  color: string;
  weeks?: number;
}

export function StreakHeatmap({ completedDateKeys, activeDays, color, weeks = 10 }: Props) {
  const days = weeks * 7;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Align the grid so it ends on today and starts on a Sunday.
  const end = new Date(today);
  end.setDate(end.getDate() + (6 - end.getDay()));
  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);

  type Cell = { key: string; active: boolean; done: boolean; future: boolean };
  const cells: Cell[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const key = toDateKey(cursor);
    cells.push({
      key,
      active: activeDays.includes(cursor.getDay()),
      done: completedDateKeys.has(key),
      future: cursor > today,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  const columns: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) columns.push(cells.slice(i, i + 7));

  return (
    <View style={styles.row}>
      {columns.map((col, i) => (
        <View key={i} style={styles.col}>
          {col.map((cell) => (
            <View
              key={cell.key}
              style={[
                styles.cell,
                cell.future
                  ? styles.futureCell
                  : !cell.active
                  ? styles.inactiveCell
                  : cell.done
                  ? { backgroundColor: color }
                  : styles.missedCell,
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 4 },
  col: { gap: 4 },
  cell: { width: 14, height: 14, borderRadius: 3 },
  inactiveCell: { backgroundColor: "#f0f0f0" },
  missedCell: { backgroundColor: "#e5e7eb" },
  futureCell: { backgroundColor: "transparent" },
});
