<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\News;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return News::published()
            ->latest('published_at')
            ->latest('created_at')
            ->latest('id')
            ->with(['author' => function($query) {
                $query->select('id', 'name');
            }])
            ->get();
    }

    public function all()
    {
        return News::latest('published_at')
            ->latest('created_at')
            ->latest('id')
            ->with(['author' => function($query) {
                $query->select('id', 'name');
            }])
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $news = new News;
        $news->author_id = $request->user()->id;
        $news->title = $request->input('title');
        $news->excerpt = $request->input('excerpt');
        $news->icon = $request->input('icon');
        $news->published_at = $request->input('published_at');
        $news->content = $request->input('content');
        $news->save();

        return $news;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return News::with(['author' => function($query) { $query->select('id', 'name'); }])
            ->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // TODO check permissions
        $news = News::find($id);
        $news->title = $request->input('title');
        $news->excerpt = $request->input('excerpt');
        $news->icon = $request->input('icon');
        $news->published_at = $request->input('published_at');
        $news->content = $request->input('content');
        $news->save();

        return $news;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // TODO role validation
        News::find($id)->delete();
    }
}
