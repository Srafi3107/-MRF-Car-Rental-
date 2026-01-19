package server;

import com.sun.net.httpserver.HttpServer;
import handler.LoginHandler;
import handler.MyRentalsHandler;
import handler.RentCarHandler;

import java.net.InetSocketAddress;

public class MainServer {

    public static void main(String[] args) throws Exception {

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/login", new LoginHandler());
        server.createContext("/rent", new RentCarHandler());
        server.createContext("/myrentals", new MyRentalsHandler());
        server.start();

        System.out.println("Server running at http://localhost:8080");
    }
}
