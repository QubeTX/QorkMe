import type { FC } from 'react';
import styles from './CommandTable.module.css';

export type CommandRow = { command: string; description: string };

type CommandTableProps = {
  rows: CommandRow[];
  /** Column headers (defaults match the product pages). */
  headers?: [string, string];
  /** Mono footnote under the table ("Run tr300 --help for full docs"). */
  footnote?: string;
};

/**
 * The technical register's command reference table — generalized from the
 * reports.qubetx.com COMMANDS sections. Real table semantics; mono command
 * column; hairline rows that brighten on hover (CSS only).
 */
const CommandTable: FC<CommandTableProps> = ({
  rows,
  headers = ['Command', 'Description'],
  footnote,
}) => (
  <div className={styles.wrap}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">{headers[0]}</th>
          <th scope="col">{headers[1]}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.command}>
            <td className={styles.command}>
              <code>{row.command}</code>
            </td>
            <td className={styles.description}>{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {footnote && <p className={styles.footnote}>{footnote}</p>}
  </div>
);

export default CommandTable;
