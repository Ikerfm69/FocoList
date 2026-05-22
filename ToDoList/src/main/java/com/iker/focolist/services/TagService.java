package com.iker.focolist.services;

import com.iker.focolist.models.Tag;
import com.iker.focolist.repositories.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;

    public List<Tag> findAll() {
        return tagRepository.findAll();
    }

    public Tag findById(Long id) {
        return tagRepository.findById(id).orElseThrow(() -> new RuntimeException("Tag no encontrado"));
    }

    public Tag createTag(Tag tag) {
        return tagRepository.save(tag);
    }

    public Tag updateTag(Long id, Tag tag) {
        Tag existing = findById(id);
        existing.setName(tag.getName());
        return tagRepository.save(existing);
    }

    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
    }
}