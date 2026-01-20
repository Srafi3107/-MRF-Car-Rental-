package repository;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class FileRepository {

    private static final String DATA_DIR = "data";

    public FileRepository() {
        File dir = new File(DATA_DIR);
        if (!dir.exists()) {
            dir.mkdir();
        }
    }

    public List<String> readAllLines(String filename) {
        List<String> lines = new ArrayList<>();
        File file = new File(DATA_DIR, filename);
        if (!file.exists()) {
            return lines;
        }

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    lines.add(line);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return lines;
    }

    public void writeAllLines(String filename, List<String> lines) {
        File file = new File(DATA_DIR, filename);
        try (PrintWriter pw = new PrintWriter(new FileWriter(file))) {
            for (String line : lines) {
                pw.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void appendLine(String filename, String line) {
        File file = new File(DATA_DIR, filename);
        try (PrintWriter pw = new PrintWriter(new FileWriter(file, true))) {
            pw.println(line);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
