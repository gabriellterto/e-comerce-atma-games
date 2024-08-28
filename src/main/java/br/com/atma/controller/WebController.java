package br.com.atma.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String index() {
        return "index"; 
    }

    @GetMapping("/cadastro")
    public String cadastro() {
        return "cadastro"; 
    }

    @GetMapping("/perfil")
    public String perfil() {
        return "perfil";
    }

    @GetMapping("/detalhes")
    public String detalhes() {
        return "detalhes";
    }

    @GetMapping("/jogos")
    public String jogos() {
        return "jogos";
    }

    @GetMapping("/adm")
    public String adm() {
        return "adm";
    }

    @GetMapping("/logout")
    public String logout() {
        return "index";
    }

    @GetMapping("/carrinho")
    public String carrinho() {
        return "carrinho";
    }

    @GetMapping("/pagamentoSucesso")
    public String pagamentoSucesso() {
        return "pagamentoSucesso";
    }
}
