package br.com.atma.Service;

import br.com.atma.model.Category;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import br.com.atma.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;




    @Service
    public class CategoryService {

        @Autowired
        private CategoryRepository categoryRepository;

        public List<Category> getAllCategories() {

            return categoryRepository.findAll();
        }

        public Optional<Category> getCategoryById(Long id) {
            return categoryRepository.findById(id);
        }

        @Transactional
        public Category saveCategory(Category category) {
            return categoryRepository.save(category);
        }

        @Transactional
        public void deleteCategory(Long id) {
            categoryRepository.deleteById(id);
        }
    }





